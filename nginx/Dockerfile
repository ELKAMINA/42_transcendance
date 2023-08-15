FROM	nginx:alpine

#This command is for installing selfsigned certificate
RUN apk add openssl \
    && openssl req -new				\
		-newkey rsa:4096			\
		-x509						\
		-sha256						\
		-days 365					\
		-nodes						\ 
		-out /etc/nginx/cert.crt	\
		-keyout /etc/nginx/cert.key	\
		-subj "/C=FR/ST=France/L=Paris/O=42/CN=localhost"

# C: Country
# ST: State or Province
# L: Locality or City
# O: Organization
# CN: Common Name (e.g., domain name)

COPY	./default.conf /etc/nginx/conf.d/.

ARG domain_name=localhost

RUN sed -i 's/DOMAIN_NAME/'${domain_name}'/' /etc/nginx/conf.d/default.conf
# EXPOSE 3000

# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]