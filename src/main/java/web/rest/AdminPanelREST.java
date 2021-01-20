package web.rest;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import web.models.User;
import web.models.UserDTO;
import web.services.UserService;


import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/")
public class AdminPanelREST {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public AdminPanelREST(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("listUsers")
    public ResponseEntity<List<UserDTO>> index() {

        List<UserDTO> dtoUsers = userListConvertToDTO(userService.listUsers());
        return dtoUsers != null
                ? new ResponseEntity<>(dtoUsers, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable(name = "id") Long id) {

        UserDTO userDTO = convertToDto(userService.getUserById(id));
        return userDTO != null
                ? new ResponseEntity<>(userDTO, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("user/update")
    public ResponseEntity<UserDTO> update(@RequestBody UserDTO userDTO) {
        try {
            userService.update(convertToEntity(userDTO));
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("user/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
        try {
            userService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("user/create")
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO userDTO) {
        try {
            userService.save(convertToEntity(userDTO));
            return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    private UserDTO convertToDto(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    private User convertToEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public List<UserDTO> userListConvertToDTO(List<User> users) {
        List<UserDTO> dtoUsers = new ArrayList<>();
        users.forEach(user -> dtoUsers.add(convertToDto(user)));
        return dtoUsers;
    }
}
