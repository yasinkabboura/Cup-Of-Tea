package com.enset.cup_of_teabackend.security.service;

import com.enset.cup_of_teabackend.security.entities.AppRole;
import com.enset.cup_of_teabackend.security.entities.AppUser;
import com.fasterxml.jackson.core.JsonProcessingException;


import java.util.List;

public interface AccountService {
    AppUser addNewUser(AppUser appUser);
    AppRole addNewRole(AppRole appRole);
    void addRoleToUser(String username,String roleName);
    AppUser loadUserByUsername(String username);

    String loadUserByUsernameWithoutPass(String username) throws JsonProcessingException;

    List<AppUser> listUsers();
}
