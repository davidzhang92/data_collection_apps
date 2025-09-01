FROM ubuntu:latest AS base

EXPOSE 3000 4000
RUN apt update && apt install \
    iproute2 \
    supervisor \
    python3-pip \
    python3.12-venv \
    nginx \
    nano \
    unixodbc \
    -y 

ADD  . /data-storage/sfdc_apps
COPY ./nginx/sfdc /etc/nginx/sites-enabled
COPY ./supervisord_backend_container.conf /etc/supervisor/conf.d


RUN python3 -m venv env0
# same as running source /env0/bin/activate
RUN bash -c "source /env0/bin/activate" 
RUN bash -c "/env0/bin/pip install --upgrade pip"
RUN bash -c "/env0/bin/pip install -r /data-storage/sfdc_apps/requirements.txt"
# CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
ENTRYPOINT ["tail", "-f", "/dev/null"]