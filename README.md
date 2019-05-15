# InterviewSample
Microservices architecture, ApiGateway, IdentityService (STS), SampleApiService, Clients: Angular

# How to use
1) Get repository clone :)
2) Run in powershell or command prompt:
   - "C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" setupsslUrl -url:https://localhost:44001/ -UseSelfSigned
   - "C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" setupsslUrl -url:https://localhost:44002/ -UseSelfSigned
   - "C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" setupsslUrl -url:https://localhost:44003/ -UseSelfSigned
3) Open All.sln in visual studio
   - In solution properties setup Multiple startup projects to
     - Angular - Start 
     - ApiGateway - Start without debugging
     - Data.Api - Start without debugging
     - Identity - Start without debugging
4) Change Clients\Angular\Angular\Properties\launchSettings.json ssl port to 44308
5) Run in powershell or command prompt:
   - "C:\Program Files (x86)\IIS Express\IisExpressAdminCmd.exe" setupsslUrl -url:https://localhost:44308/ -UseSelfSigned
6) Run All.Sln in Visual Studio
   - for first run you need soo many minutes until npm manager get all necessary packages for angular projects. Be patiente. 

If you have some troubles with iisexpress, you can changed http port in project Data.Api, Identity and ApiGateway. Don't changes SSL ports.
