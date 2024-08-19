package com.example.interviewback.util;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.util.regex.Pattern;

public class ValidationUtil {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS;

    private static final int PASSWORD_LENGTH = 8;

    public static String generatePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        password.append(UPPERCASE.charAt(random.nextInt(UPPERCASE.length())));
        password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        for (int i = 2; i < PASSWORD_LENGTH; i++) {
            password.append(ALL_CHARACTERS.charAt(random.nextInt(ALL_CHARACTERS.length())));
        }

        return shuffleString(password.toString());
    }

    private static String shuffleString(String str) {
        SecureRandom random = new SecureRandom();
        char[] array = str.toCharArray();
        for (int i = array.length - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            char temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
        return new String(array);
    }

    public static boolean validatePassword(String password) {
        if (password == null) {
            return false;
        }

        boolean hasNumber = password.matches(".*\\d.*");
        boolean hasUppercase = password.matches(".*[A-Z].*");
        boolean isLongEnough = password.length() >= 7;

        return hasNumber && hasUppercase && isLongEnough;
    }

    public static String generateUsername(String fullName) {
        String[] name = fullName.split(" ");
        StringBuilder username = new StringBuilder(name[name.length - 1]);
        for (int i = 0; i < name.length - 1; ++i) {
            username.append(name[i].toUpperCase().charAt(0));
        }
        return convertAccents(username.toString());
    }

    private static String convertAccents(String input) {
        input = input.replaceAll("[đ]", "d").replaceAll("[Đ]", "D");
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("");
    }
}
