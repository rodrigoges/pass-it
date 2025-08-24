package br.com.api.passit.services;

import br.com.api.passit.db.Users;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.utils.JWTUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtil;

    public AuthService(UsersRepository usersRepository, PasswordEncoder passwordEncoder, JWTUtils jwtUtil) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(String email, String password) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new FlowException("User not found", HttpStatus.NOT_FOUND));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new FlowException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        return jwtUtil.generateToken(user.getUserId(), user.getEmail());
    }
}
