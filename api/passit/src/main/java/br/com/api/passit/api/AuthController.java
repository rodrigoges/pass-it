package br.com.api.passit.api;

import br.com.api.passit.services.AuthService;
import br.com.api.passit.to.LoginRequestTO;
import br.com.api.passit.to.LoginResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseTO> login(@RequestBody LoginRequestTO request) {
        var response = authService.login(request.email(), request.password());
        return ResponseEntity.ok(response);
    }
}
