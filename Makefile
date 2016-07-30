

publish:
	rsync -avz --delete --exclude=.git --exclude=Makefile ./ oscar:/opt/sites/light.wtf/



.PHONY: publish
