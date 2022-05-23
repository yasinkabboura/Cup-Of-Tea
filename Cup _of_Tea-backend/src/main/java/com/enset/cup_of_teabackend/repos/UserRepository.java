package com.enset.cup_of_teabackend.repos;

import com.enset.cup_of_teabackend.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser,Long> {

    AppUser findUserByUsername(String username);
    AppUser findUserByEmail(String email);

}
