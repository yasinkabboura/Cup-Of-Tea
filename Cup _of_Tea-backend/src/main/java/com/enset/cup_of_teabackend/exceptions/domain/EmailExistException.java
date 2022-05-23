package com.enset.cup_of_teabackend.exceptions.domain;

public class EmailExistException extends Exception{

    public EmailExistException(String message){
        super(message);
    }
}
