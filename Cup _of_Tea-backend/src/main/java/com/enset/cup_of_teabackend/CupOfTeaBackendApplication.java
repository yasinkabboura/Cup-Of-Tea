package com.enset.cup_of_teabackend;

import com.enset.cup_of_teabackend.security.entities.AppRole;
import com.enset.cup_of_teabackend.security.entities.AppUser;
import com.enset.cup_of_teabackend.security.service.AccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;

@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true)
public class CupOfTeaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CupOfTeaBackendApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


   // @Bean
    CommandLineRunner commandLineRunner(AccountService accountService){
        return args -> {
            accountService.addNewRole(new AppRole(null,"USER"));
            accountService.addNewRole(new AppRole(null," ADMIN"));

            accountService.addNewUser(new AppUser(null,"yasin","yasin@mail.com","profile pic","bio yasin",15,"123",new ArrayList<>()));
            accountService.addNewUser(new AppUser(null,"saad","saad@mail.com","profile pic","bio saad",15,"123",new ArrayList<>()));
            accountService.addNewUser(new AppUser(null,"rihab","rihab@mail.com","profile pic","bio rihab",15,"123",new ArrayList<>()));

            accountService.addRoleToUser("yasin","ADMIN");
            accountService.addRoleToUser("yasin","USER");
            accountService.addRoleToUser("saad","USER");
            accountService.addRoleToUser("saad","ADMIN");
            accountService.addRoleToUser("rihab","USER");
        };
    }

}
