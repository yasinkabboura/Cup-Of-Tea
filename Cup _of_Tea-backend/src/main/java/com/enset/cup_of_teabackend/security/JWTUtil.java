package com.enset.cup_of_teabackend.security;

public class JWTUtil {
    public static final String SECRET = "yasinSecret";
    public static final String AUTH_HEADER = "Authorization";
    public static final String PREFIX = "Bearer ";
    public static final long EXPIRE_ACCESS_TOKEN = 5*60*1000;
    public static final long EXPIRE_REFRESH_TOKEN = 20*60*1000;
}
