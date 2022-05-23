package com.enset.cup_of_teabackend.exceptions.domain;

public class UsernameExistException extends Exception{

    public UsernameExistException(String message){
        super(message);
    }
}
