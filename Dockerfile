FROM mundotv789123/raspadmin:java

ENV spring_web_resources_static-locations='file:/app/front'

COPY ./out /app/front
