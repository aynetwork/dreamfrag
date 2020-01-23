package com.dreamfrag.dreamfrag;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DreamfragApplication {

	public static void main(String[] args)
	{
		System.setProperty("spring.devtools.restart.enabled", "true");
		System.setProperty("spring.resources.static-locations",
				"classpath:/static/");

		SpringApplication.run(DreamfragApplication.class, args);
	}

}
