package web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.models.User;

@RestController
@RequestMapping("/api/user/")
public class UserPanelREST {

    @GetMapping("profile")
    public ResponseEntity<User> userProfile(@AuthenticationPrincipal User user) {

        user.setPassword(null);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}