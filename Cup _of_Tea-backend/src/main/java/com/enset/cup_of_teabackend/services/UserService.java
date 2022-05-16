package com.enset.cup_of_teabackend.services;

import com.enset.cup_of_teabackend.entities.AppUser;
import com.enset.cup_of_teabackend.exceptions.domain.EmailExistException;
import com.enset.cup_of_teabackend.exceptions.domain.EmailNotFoundException;
import com.enset.cup_of_teabackend.exceptions.domain.UsernameExistException;

import com.sun.xml.internal.messaging.saaj.packaging.mime.MessagingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {

    AppUser register(String firstname, String lastname, String username, String email) throws EmailExistException, UsernameExistException, MessagingException, javax.mail.MessagingException;
    List<AppUser> getUsers();

    AppUser findUserByUsername(String username);

    AppUser findUserByEmail(String email);

    AppUser addNewUser(String firstname, String lastname
                    , String username, String email
                    , String role, boolean isNonLocked
                    , boolean isActive, MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException;

    AppUser updateUser(String currentUsername,String newFirstname, String newLastname
            , String newUsername, String newEmail
            , String role, boolean isNonLocked
            , boolean isActive, MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException;

    void deleteUser(Long id);
    void resetPassword(String email) throws EmailNotFoundException, MessagingException, javax.mail.MessagingException;
    AppUser updateProfileImage(String username,MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException;
}
