# docker login listmanager.azurecr.io
cd Api/
docker build . -t listmanager/api:dev -t listmanager.azurecr.io/listmanager/api:dev
docker push listmanager.azurecr.io/listmanager/api:dev
cd ../App/
docker build . -t listmanager/app:dev -t listmanager.azurecr.io/listmanager/app:dev
docker push listmanager.azurecr.io/listmanager/app:dev