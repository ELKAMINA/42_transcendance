# -------------------------------------------------
# DOCKER SETUP
# -------------------------------------------------
DOCKER_COMPOSE_FILE	:=	./docker-compose.yaml
DOCKER_PS		:=	docker ps -a -q
DOCKER_IMAGES		:=	docker images -a -q
# -------------------------------------------------
# GLOBAL SETUP
# -------------------------------------------------
SEP_P			:=	"----------------------------------------------"
SEP_SP			:=	".............................................."
# -------------------------------------------------
# COLOR SETUP
# -------------------------------------------------
BASE=\033[
RD=$(BASE)0;31m
GN=$(BASE)0;32m
OG=$(BASE)0;33m
BU=$(BASE)0;34m
MG=$(BASE)0;35m
CY=$(BASE)0;36m
YE=$(BASE)1;33m
NC=$(BASE)0m

.PHONY:	all build create stop pause unpause restart up upd down rm ps stat stat_run stat_pause stat_exited images clean clean_containers clean_images clean_volumes clean_networks clean_prune

all:	| up

# -------------------------------------------------
# SERVICES
# -------------------------------------------------
# BUILD OR REBUILD SERVICES
build:
	docker compose --file $(DOCKER_COMPOSE_FILE) build

# CREATE A SERVICE
create:
	docker compose --file $(DOCKER_COMPOSE_FILE) create

# STOP SERVICES
stop:
	docker compose --file $(DOCKER_COMPOSE_FILE) stop

# PAUSE SERVICES
pause:
	docker compose --file $(DOCKER_COMPOSE_FILE) pause

# UNPAUSE SERVICES
unpause:
	docker compose --file $(DOCKER_COMPOSE_FILE) unpause

# RESTART SERVICES
restart:
	docker compose --file $(DOCKER_COMPOSE_FILE) restart

# -------------------------------------------------
# CONTAINERS
# -------------------------------------------------
# CREATE AND START CONTAINERS
up:
	docker compose --file $(DOCKER_COMPOSE_FILE) up --build

upd:
	docker compose --file $(DOCKER_COMPOSE_FILE) up --build --detach

# STOP AND REMOVE CONTAINERS, NETWORKS, IMAGES AND VOLUMES
down:
	docker compose --file $(DOCKER_COMPOSE_FILE) down

# REMOVE STOPPED CONTAINERS
rm:
	docker compose --file $(DOCKER_COMPOSE_FILE) rm --force --stop

# LIST CONTAINERS
ps:
	docker compose --file $(DOCKER_COMPOSE_FILE) ps --all

stat:
	make -s stat_run
	make -s stat_pause
	make -s stat_exited

stat_run:
	docker compose --file $(DOCKER_COMPOSE_FILE) ps --status=running

stat_pause:
	docker compose --file $(DOCKER_COMPOSE_FILE) ps --status=paused

stat_exited:
	docker compose --file $(DOCKER_COMPOSE_FILE) ps --status=exited

# LIST IMAGES
images:
	docker compose --file $(DOCKER_COMPOSE_FILE) images --format table

# -------------------------------------------------
# CLEAN UP
# -------------------------------------------------
clean:	| stop
	make -s -i clean_volumes
	make -s -i clean_containers
	make -s -i clean_images
	make -s -i clean_prune

clean_containers:
	docker rm $$($(DOCKER_PS))

clean_images:
	docker rmi $$($(DOCKER_IMAGES))

clean_volumes:
	docker volume rm $$(docker volume ls -q)

clean_networks:
	docker network rm $$(docker network ls -q)
	
clean_prune:
	docker system prune --all --force
