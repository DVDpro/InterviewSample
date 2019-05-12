using Data.Api;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using System.Net.Http;
using IdentityModel.Client;

namespace Data.Test
{
    public class PrivateValuesControllerTest : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public PrivateValuesControllerTest(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/PrivateValues")]
        public async Task Get_Unauthorized(string url)
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync(url);
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Theory]
        [InlineData("/api/PrivateValues")]
        public async Task Get_Success(string url)
        {
            var apiClient = _factory.CreateClient();

            // auth to STS
            var srvConfiguration = (IConfiguration)_factory.Server.Host.Services.GetService(typeof(IConfiguration));
            var srvIdentityUrl = srvConfiguration["IdentityServiceUrl"];
            using (var identityClient = new System.Net.Http.HttpClient())
            {
                identityClient.BaseAddress = new Uri(srvIdentityUrl);
                var discoveryResponse = await identityClient.GetDiscoveryDocumentAsync();
                if (discoveryResponse.IsError)
                    throw new Exception($"Identity service at {srvIdentityUrl} failed or not running. {discoveryResponse.Error}", discoveryResponse.Exception);

                var request = new AuthorizationCodeTokenRequest();
                request.Address = discoveryResponse.AuthorizeEndpoint;
                var tokenResponse = await identityClient.RequestAuthorizationCodeTokenAsync(request);

                if (tokenResponse.IsError)
                    throw new Exception($"Authentication failed! {tokenResponse.Error} {tokenResponse.ErrorDescription}", tokenResponse.Exception);

                apiClient.SetBearerToken(tokenResponse.AccessToken);

            }

            var response = await apiClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());            
        }
    }
}