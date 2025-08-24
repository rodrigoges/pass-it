package br.com.api.passit.api;

import br.com.api.passit.services.UsersServices;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersServices usersServices;

    @PostMapping
    public ResponseEntity<UsersResponseTO> create(@RequestBody UsersRequestTO request) {
        var response = usersServices.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
