FROM ubuntu:24.10 AS base

EXPOSE 3000 4000
RUN apt update && apt install \
    iproute2 \
    supervisor \
    python3-pip \
    python3-venv \
    nginx \
    nano \
    unixodbc \
    curl \
    -y 

#Download and install the Microsoft ODBC driver for SQL Server on Ubuntu
#https://learn.microsoft.com/en-us/sql/connect/odbc/

RUN curl -sSL -O https://packages.microsoft.com/config/ubuntu/$(grep VERSION_ID /etc/os-release | cut -d '"' -f 2)/packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb
RUN apt update
RUN ACCEPT_EULA=Y apt install -y msodbcsql18
# optional: for bcp and sqlcmd
RUN ACCEPT_EULA=Y apt install -y mssql-tools18
RUN echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
RUN bash -c "source ~/.bashrc" 

ADD  . /data-storage/sfdc_apps
COPY ./nginx/sfdc /etc/nginx/sites-enabled
COPY ./configs/supervisord_backend_container.conf /etc/supervisor/conf.d
COPY ./configs/odbc.ini /etc/
RUN rm /etc/init.d/nginx

RUN python3 -m venv env0
# same as running source /env0/bin/activate
RUN bash -c "source /env0/bin/activate" 
RUN bash -c "/env0/bin/pip install --upgrade pip"
RUN bash -c "/env0/bin/pip install -r /data-storage/sfdc_apps/requirements.txt"
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]