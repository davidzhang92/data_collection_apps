FROM ubuntu:latest AS base

EXPOSE 3001 4001
RUN apt update && apt install \
    iproute2 \
    supervisor \
    python3-pip \
    python3.12-venv \
    nginx \
    -y 

ADD  . /sfdc_apps
COPY ./nginx/sfdc /etc/nginx/sites-available

RUN python3 -m venv env0
# same as running source /env0/bin/activate
RUN bash -c "source /env0/bin/activate" 
RUN bash -c "/env0/bin/pip install --upgrade pip"
RUN bash -c "/env0/bin/pip install -r /sfdc_apps/requirements.txt"
RUN service nginx start

# CMD ["sh", "-c", "ls -la /etc >> /logs/ls.log && ip a >> /logs/ip_a.log"]
ENTRYPOINT ["tail", "-f", "/dev/null"]