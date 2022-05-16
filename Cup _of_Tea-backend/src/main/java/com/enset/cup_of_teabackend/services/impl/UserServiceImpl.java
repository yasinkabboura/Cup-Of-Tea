package com.enset.cup_of_teabackend.services.impl;

import com.enset.cup_of_teabackend.entities.AppUser;
import com.enset.cup_of_teabackend.entities.UserPrincipal;
import com.enset.cup_of_teabackend.enumerations.Role;
import com.enset.cup_of_teabackend.exceptions.domain.EmailExistException;
import com.enset.cup_of_teabackend.exceptions.domain.EmailNotFoundException;
import com.enset.cup_of_teabackend.exceptions.domain.UsernameExistException;
import com.enset.cup_of_teabackend.repos.UserRepository;
import com.enset.cup_of_teabackend.services.EmailService;
import com.enset.cup_of_teabackend.services.LoginAttemptService;
import com.enset.cup_of_teabackend.services.UserService;

import com.sun.xml.internal.messaging.saaj.packaging.mime.MessagingException;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import static com.enset.cup_of_teabackend.constants.FileConstant.*;
import static com.enset.cup_of_teabackend.constants.UserImplConstant.*;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.apache.commons.lang3.StringUtils.EMPTY;

@Service
@Transactional
@Qualifier("UserDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {
    private Logger logger = LoggerFactory.getLogger(getClass());
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private LoginAttemptService loginAttemptService;
    private EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, LoginAttemptService loginAttemptService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findUserByUsername(username);
        if (user == null) {
            logger.error("User not found by username "+username);
            throw new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME+username);
        }else {
            validateLoginAttempt(user);
            user.setLastLoginDateDisplay(user.getLastLoginDate());
            user.setLastLoginDate(new Date());
            userRepository.save(user);
            UserPrincipal userPrincipal = new UserPrincipal(user);
            logger.info("Returning found user by username "+username);
            return userPrincipal;
        }
    }

    private void validateLoginAttempt(AppUser user) {
        if(user.isNotLocked()){
            if(loginAttemptService.hasExceededMaxAttempts(user.getUsername())){
                user.setNotLocked(false);
            }else {
                user.setNotLocked(true);
            }
        }else {
            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
        }

    }


    @Override
    public AppUser register(String firstname, String lastname,String username, String email) throws EmailExistException, UsernameExistException, MessagingException, javax.mail.MessagingException {
        validateUsernameAndEmail(StringUtils.EMPTY,username,email);
        AppUser user = new AppUser();
        user.setUserId(generateUserId());
        String password = generatePassword();
        String encodedPassword=encodePassword(password);
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setUsername(username);
        user.setEmail(email);
        user.setJoinDate(new Date());
        user.setPassword(encodedPassword);
        user.setActive(true);
        user.setNotLocked(true);
        user.setRole(Role.ROLE_USER.name());
        user.setAuthorities(Role.ROLE_USER.getAuthorities());
        user.setProfileImageUrl(getTemporaryProfileImageUrl(username));
        userRepository.save(user);
        logger.info("New user password : "+password);
        emailService.sendNewPasswordEmail(firstname,password,email);
        return user;
    }

    private String getTemporaryProfileImageUrl(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(DEFAULT_USER_IMAGE_PATH+username).toUriString();
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

    private String generateUserId() {
        return RandomStringUtils.randomNumeric(10);// on peut travailer avec UUID
    }

    private AppUser validateUsernameAndEmail(String currentUsername ,String newUsername,String newEmail) throws EmailExistException, UsernameExistException {
        AppUser userByNewUsername=findUserByUsername(newUsername);
        AppUser userByNewEmail=findUserByEmail(newEmail);
        if(StringUtils.isNotBlank(currentUsername)){
            AppUser currentUser=findUserByUsername(currentUsername);
            if(currentUser == null){
                throw new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME +currentUsername);
            }
            if(userByNewUsername!=null && currentUser.getId().equals(userByNewUsername.getId())){
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if(userByNewEmail!=null && currentUser.getId().equals(userByNewEmail.getId())){
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
            return currentUser;
        }else {
            if(userByNewUsername!= null){
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if(userByNewEmail!=null){
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
            return null;

        }


    }


    @Override
    public List<AppUser> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public AppUser findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public AppUser findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public AppUser addNewUser(String firstname, String lastname, String username, String email, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException {
        validateUsernameAndEmail(EMPTY,username,email);
        AppUser user = new AppUser();
        String password = generatePassword();
        String encodedPassword = encodePassword(password);
        user.setUserId(generateUserId());
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setUsername(username);
        user.setEmail(email);
        user.setJoinDate(new Date());
        user.setPassword(encodedPassword);
        user.setActive(isActive);
        user.setNotLocked(isNonLocked);
        user.setRole(getRoleEnumName(role).name());
        user.setProfileImageUrl(getTemporaryProfileImageUrl(username));
        userRepository.save(user);
        saveProfileImage(user,profileImage);
        return user;
    }

    private void saveProfileImage(AppUser user, MultipartFile profileImage) throws IOException {
        if(profileImage!=null){
            Path userFolder = Paths.get(USER_FOLDER+user.getUsername()).toAbsolutePath().normalize();
            if(!Files.exists(userFolder)){
                Files.createDirectories(userFolder);
                logger.info(DIRECTORY_CREATED +userFolder);
            }
            Files.deleteIfExists(Paths.get(userFolder+user.getUsername()+DOT+JPG_EXTENSION));
            Files.copy(profileImage.getInputStream(),userFolder.resolve(user.getUsername()+DOT+JPG_EXTENSION),REPLACE_EXISTING);
            user.setProfileImageUrl(setProfileImageUrl(user.getUsername()));
            userRepository.save(user);
            logger.info(FILE_SAVED_IN_FILE_SYSTEM+profileImage.getOriginalFilename());
        }
    }

    private String setProfileImageUrl(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(USER_IMAGE_PATH+username+FORWARD_SLASH+username+DOT+JPG_EXTENSION).toUriString();

    }

    private Role getRoleEnumName(String role) {
        return Role.valueOf(role.toUpperCase());
    }

    @Override
    public AppUser updateUser(String currentUsername, String newFirstname, String newLastname, String newUsername, String newEmail, String role, boolean isNonLocked, boolean isActive, MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException {
        AppUser currentUser = validateUsernameAndEmail(currentUsername,newUsername,newEmail);
        currentUser.setFirstname(newFirstname);
        currentUser.setLastname(newLastname);
        currentUser.setUsername(newUsername);
        currentUser.setEmail(newEmail);
        currentUser.setActive(isActive);
        currentUser.setNotLocked(isNonLocked);
        currentUser.setRole(getRoleEnumName(role).name());
        currentUser.setAuthorities(getRoleEnumName(role).getAuthorities());
        userRepository.save(currentUser);
        saveProfileImage(currentUser,profileImage);
        return currentUser;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void resetPassword(String email) throws EmailNotFoundException, MessagingException, javax.mail.MessagingException {
        AppUser user = userRepository.findUserByEmail(email);
        if(user == null){
            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL +email);
        }
        String password = generatePassword();
        user.setPassword(encodePassword(password));
        userRepository.save(user);
        emailService.sendNewPasswordEmail(user.getFirstname(),password,user.getEmail());
    }

    @Override
    public AppUser updateProfileImage(String username, MultipartFile profileImage) throws EmailExistException, UsernameExistException, IOException {
        AppUser user = validateUsernameAndEmail(username,null,null);
        saveProfileImage(user,profileImage);
        return user;
    }
}
