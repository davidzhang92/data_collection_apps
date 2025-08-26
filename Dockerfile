FROM ubuntu:latest AS base
RUN apt update && apt install -y iproute2
ADD  . /sfdc_apps
RUN apt install supervisor -y


FROM python:latest
COPY --from=base /sfdc_apps /sfdc_apps
WORKDIR /sfdc_apps
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# CMD ["sh", "-c", "ls -la /etc >> /logs/ls.log && ip a >> /logs/ip_a.log"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]