FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app
COPY . .
RUN dotnet publish -c Release

FROM mcr.microsoft.com/dotnet/aspnet:5.0
COPY --from=build /app/bin/Release/net5.0/publish/ /app
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8101/
EXPOSE 8101/tcp
CMD ["dotnet","Api.dll"]