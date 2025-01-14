FROM mundotv789123/raspadmin:java

ENV spring_web_resources_static-locations='file:/home/app/front'

COPY ./out /home/app/front
