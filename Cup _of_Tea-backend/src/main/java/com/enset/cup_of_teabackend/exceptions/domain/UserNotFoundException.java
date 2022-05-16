package com.enset.cup_of_teabackend.exceptions.domain;

public class UserNotFoundException extends Exception{

    public UserNotFoundException(String message){
        super(message);
    }
}
