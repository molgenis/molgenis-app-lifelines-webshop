#!/bin/sh
# Copies the dist dir to the docker context so that it can be copied into container.
rm -rf docker/dist
mkdir -p docker/dist/@molgenis-app/lifelines-webshop/dist
cp -rf dist docker/dist/@molgenis-app/lifelines-webshop