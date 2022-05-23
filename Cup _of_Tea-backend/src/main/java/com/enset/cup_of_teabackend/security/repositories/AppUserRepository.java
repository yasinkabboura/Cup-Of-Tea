package com.enset.cup_of_teabackend.security.repositories;

import com.enset.cup_of_teabackend.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    AppUser findByUsername(String username);
}
