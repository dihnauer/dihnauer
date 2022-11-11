## Usage

### 1 - Create Spotify Application

First, we need to create a Spotify application to give us credentials to authenticate with the API.

- Go to your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in.
- Click <b>Create an App</b>.
- Fill out the name and description and click create.
- Click <b>Show Client Secret</b>.
- Save your Client ID and Client Secret. You'll need these soon.
- Click <b>Edit Settings</b>.
- Add `http://localhost:3000` as a redirect URI.

All done! You now have a properly configured Spotify application and the correct credentials to make requests.

### 2 - Authentication

There are a variety of ways to authenticate with the Spotify API, depending on your application. Since we only need permission granted once, we'll use the [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/).

First, we'll have our application request authorization by logging in with whatever [scopes](https://developer.spotify.com/documentation/general/guides/authorization/scopes/) we need. Here's an example of what the URL might look like. Swap out the `client_id` and scopes for your own.

<pre>
https://accounts.spotify.com/authorize?client_id=8e94bde7dd
b84a1f7a0e51bf3bc95be8&response_type=code&redirect_uri=http
%3A%2F%2Flocalhost:3000&scope=user-read-currently-playing%20
user-top-read
</pre>

After authorizing, you'll be redirected back to your `redirect_uri`. In the URL, there's a `code` query parameter. Save this value.

<pre>
http://localhost:3000/callback?code=NApCCg..BkWtQ
</pre>

Next, we'll need to retrieve the refresh token. You'll need to generate a Base 64 encoded string containing the client ID and secret from earlier. You can use [this tool](https://www.base64encode.org/) to encode it online. The format should be `client_id:client_secret`.

<pre>
curl -H "Authorization: Basic {base64 encoded client_id:client_secret}"
-d grant_type=authorization_code -d code={code} -d redirect_uri=http%3A
%2F%2Flocalhost:3000 https://accounts.spotify.com/api/token
</pre>

This will return a JSON response containing a `refresh_token`. This token is [valid indefinitely](https://github.com/spotify/web-api/issues/374) unless you revoke access, so we'll want to save this in an environment variable.

### 3 - Add Environment Variables

To securely access the API, we need to include the secret with each request. We also do not want to commit secrets to git. Thus, we should use an environment variable. Learn how to add [environment variables in Vercel](https://vercel.com/docs/environment-variables).
