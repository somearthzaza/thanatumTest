FROM mysql:8.3.23

ADD db.sql /docker-entrypoint-initdb.d