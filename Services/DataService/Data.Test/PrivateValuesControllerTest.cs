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
            var apiClient = await _factory.CreateAuthClientAsync(); //get authorized client to inmemory data.api server

            var response = await apiClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());            
        }
    }
}