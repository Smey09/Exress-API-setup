## Docker Command

1. **How to create image :**

   - Create `Dockerfile` or `Dockerfile.dev`
   - run : docker build -f `<Dockerfile_name>` -t `<name_for_image>` .
     - example : `docker build -f Dockerfile.dev -t my-app-dev .`
     - `-f Dockerfile.dev`: Specifies the Dockerfile.
     - `-t my-app-dev`: Tags the created Docker image with the name `my-app-dev`.
     - **`.`**: location of the `Dockerfile`
     - This command builds a Docker image using `Dockerfile.dev` and tags it as `my-app-dev`.
   - to show all images :
     - run : `docker images`

2. **How to delete image :**

   - run : `docker ps` to show list of containers
   - copy `image ID` that you want to `delete`
   - run : `docker rmi -f <image_ID>`

3. **How to run and create Docker Container**

   - run : docker run -p 3000:3000 -d --name my-container-app my-app-dev
     - `p 3000:3000`: Maps port 3000 on the host to port 3000 in the container.
     - `d`: Runs the container in the background (detached mode).
     - `-name my-container-app`: Names the container `dev-app`.
     - `my-app-dev`: Specifies the Docker image to use.
     - This command starts a container from the `my-app-dev` image, running it in the background with port 3000 exposed.

4. **How to Start and Stop Container**

   - run : `docker ps` to find the container ID or name by listing the running containers.
   - run : `docker start <id_Container>` or `<name_Container>`
   - run : `docker stop <id_Container>` or `<name_Container>`

5. **How to Check only Container running :**

   - run : `docker ps`

6. **How to Check all Container :**

   - run : `docker ps -a`
   - how to short or format it :
     - run : `docker ps -a --format "table {{.ID}}\t{{.Image}}”`
     - run : `docker ps -a --format "{{.ID}}\t{{.Image}}”` No tables
       - `\t` use for get space

7. **How to go inside Container or access running :**

   - run : `docker ps` to find the container ID or name by listing the running containers.
   - run : `docker exec -it <container_id> /bin/bash` or `/bin/sh` or `sh`
   - example : `docker exec -it my-container-app sh`

8. **How to logs into Container when it running**

   - run : `docker logs -f <container_name>`
   - example : `docker logs -f express_part_01`

9. **How to Create and inspect volume in docker**

   - run : `docker volume create <volume_name>`
   - run : `docker volume inspect <volume_name>`

# Summary Command line on Docker

1. **Containers Summary**

   - To list all running containers:
     - run : `docker ps`
   - To list all containers (including stopped ones):
     - run : `docker ps -a`

2. **Images Summary**

   - To list all Docker images:
     - run : `docker images`

3. **Volumes Summary**

   - To list all Docker volumes:
     - run : `docker volume ls`

4. **Networks Summary**

   - To list all Docker networks:
     - run : `docker network ls`

5. **System-wide Summary**

   - To display an overview of Docker system usage (e.g., disk usage, volumes, images):
     - run : `docker system df`

6. **Detailed System-wide Information**

   - To view detailed information about the Docker installation, including containers, images, and resources:
     - run : `docker info`

7. **Docker Compose Summary**

   - To view the status of services in a Docker Compose setup:
     - run : `docker-compose ps`

8. `d` (Detached Mode)

   - Used with `docker run` to run a container in the background (detached mode). This allows you to keep the container running without attaching your terminal to it.
     - example : `docker run -d nginx`
     - This runs an Nginx container in the background.

9. **`v` (Volume)**

   - Used with `docker run` to mount a volume or bind-mount a directory from the host into the container. It allows you to persist data and share data between the host and container.
     - example : docker run -v /host/path:/container/path nginx
     - This mounts `/host/path` from the host into `/container/path` in the container.

10. **`f` (File)**

    - Used with `docker-compose` to specify a custom Compose file. By default, `docker-compose` looks for a file named `docker-compose.yml`, but you can use `-f` to specify a different file.
      - example : `docker-compose -f my-compose-file.yml up`
      - This uses `my-compose-file.yml` instead of the default `docker-compose.yml`.

11. **`p` (Port)**

    - Used with `docker run` to map a port on the host to a port in the container.
      - exmaple : `docker run -p 8080:80 nginx`
      - This maps port 8080 on the host to port 80 in the container.

12. `t` (TTY)

    - Used with `docker run` to allocate a pseudo-TTY. Often used in combination with `-i` to run a container interactively.
      - example : `docker run -it ubuntu`
      - This runs an Ubuntu container interactively with a TTY.

13. **`i` (Interactive)**

    - Used with `docker run` to keep STDIN open, allowing you to interact with the container.
      - example : `docker run -it ubuntu`
      - This runs an Ubuntu container interactively with STDIN open.

14. **`a` (Attach)**

    - Used with `docker logs` to attach to the logs of a container. Useful for viewing the logs in real time.
      - example : `docker logs -f my_container`
      - This follows (tails) the logs of `my_container`.

15. **`-rm`**

    - Used with `docker run` to automatically remove the container when it exits.
      - example : `docker run --rm ubuntu`
      - This runs an Ubuntu container that will be removed automatically after it exits.

16. **`e` (Environment Variable)**

    - Used with `docker run` to set environment variables in the container.
      - example : `docker run -e MY_VAR=value nginx`
      - This sets the environment variable `MY_VAR` to `value` in the Nginx container.

17. **`-network`**

    - Used with `docker run` to specify a network for the container to connect to.
      - example : `docker run --network my_network nginx`
      - This connects the Nginx container to `my_network`.

18. **`l` (Label)**

    - Used with `docker build` and `docker run` to add metadata to images or containers.
      - example : `docker build -t my_image -l version=1.0 .`
      - This tags the built image with a label `version=1.0`.
