if [ ! -f "/app/.prod" ] #Checking if react app has been already built (with npm run build)
then #if not
	npm run build && 

    #====Copy the nginx configuration and built app files to the appropriate nginx directories. Nginx by default reads conf in http.d===
    cp /app/nginx.conf /etc/nginx/http.d/. &&  

    #Copy RECURSIVELY (-r) which means that we want directory and their subdirectories and contents
    #build is the directory containing the built version of our react app (after npm run build)
    #/var/www/html : is the default directory from which Nginx serves static files. We want to copy the built version of our react app to this location so Nginx can serve it
	cp -r /app/build /var/www/html && 

    #This is copying RECURSIVELY the contents of the built React app (/app/build/*) to a save directory 
    #within /app. It seems like a way to save or backup the current built version of the application
	# cp -r /app/build/* /app/save/. && 

    #Creating a ".prod" file. This is only a flag to say that the built step has been already done if the container has to re-run or stg.
    #it makes the script knows what to do
	# touch /app/save/.prod
	touch /app/.prod

else
	cp /app/nginx.conf /etc/nginx/http.d/.
	cp -r /app/build /var/www/html
fi
# Start nginx in the foreground. The 'daemon off' configuration ensures nginx doesn't run as a background process, which is essential for Docker containers because containers are designed to run foreground processes.
nginx -g 'daemon off;'