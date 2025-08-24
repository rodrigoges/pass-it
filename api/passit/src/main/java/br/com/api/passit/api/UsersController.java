package br.com.api.passit.api;

import br.com.api.passit.services.UsersServices;
import br.com.api.passit.to.GetUsersRequestTO;
import br.com.api.passit.to.GetUsersResponseTO;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

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

    @PutMapping("/{userId}")
    public ResponseEntity<UsersResponseTO> update(@PathVariable UUID userId, @RequestBody UsersRequestTO request) {
        var response = usersServices.update(userId, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    public ResponseEntity<GetUsersResponseTO> get(@ModelAttribute GetUsersRequestTO request) {
        var response = usersServices.get(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
