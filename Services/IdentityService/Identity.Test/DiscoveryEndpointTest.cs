using Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using System.Net.Http;
using IdentityModel.Client;

namespace Identity.Test
{
    public class DiscoveryEndpointTest : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public DiscoveryEndpointTest(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetDiscoverySuccess()
        {
            var client = _factory.CreateClient();
            var response = await client.GetDiscoveryDocumentAsync();
            Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
            Assert.Equal("http://localhost/connect/authorize", response.AuthorizeEndpoint);
            Assert.Equal("http://localhost/connect/token", response.TokenEndpoint);
        }

    }
}