using Data.Api;
using IdentityModel.Client;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Data.Test
{
    public static class Support
    {
        public static async Task<System.Net.Http.HttpClient> CreateAuthClientAsync(this WebApplicationFactory<Startup> factory)
        {
            var apiClient = factory.CreateClient();

            // auth to STS
            var srvConfiguration = (IConfiguration)factory.Server.Host.Services.GetService(typeof(IConfiguration));
            var srvIdentityUrl = srvConfiguration["IdentityServiceUrl"];
            using (var identityClient = new System.Net.Http.HttpClient())
            {
                identityClient.BaseAddress = new Uri(srvIdentityUrl);
                var discoveryResponse = await identityClient.GetDiscoveryDocumentAsync();
                if (discoveryResponse.IsError)
                    throw new Exception($"Identity service at {srvIdentityUrl} failed or not running. {discoveryResponse.Error}", discoveryResponse.Exception);

                // use custom local account password for testing purpose
                var request = new PasswordTokenRequest();
                request.Address = discoveryResponse.TokenEndpoint;
                request.ClientCredentialStyle = ClientCredentialStyle.PostBody;
                request.Scope = "data";
                request.ClientId = "api.client.test";
                request.ClientSecret = srvConfiguration["TestUser:ClientSecret"];
                request.UserName = srvConfiguration["TestUser:Name"];
                request.Password = srvConfiguration["TestUser:Password"];

                var tokenResponse = await identityClient.RequestPasswordTokenAsync(request);

                if (tokenResponse.IsError)
                    throw new Exception($"Authentication failed! {tokenResponse.Error} {tokenResponse.ErrorDescription}", tokenResponse.Exception);

                apiClient.SetBearerToken(tokenResponse.AccessToken);
            }
            return apiClient;
        }
    }
}
