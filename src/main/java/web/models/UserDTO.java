package web.models;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private int age;
    private String city;
    private String email;
    private String password;
    private Set<Role> roles = new HashSet<>();

}
