package br.com.api.passit.services;

import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.AddressesMapper;
import br.com.api.passit.mappers.UsersMapper;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsersServices {

    private final UsersRepository usersRepository;
    private final UsersMapper usersMapper;
    private final AddressesMapper addressesMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsersResponseTO create(UsersRequestTO request) {
        var emailFounded = usersRepository.findByEmail(request.email());
        if (emailFounded.isPresent()) {
            throw new FlowException("E-mail " + request.email() + " already registered.", HttpStatus.BAD_REQUEST);
        }
        var nationalIdentifierFounded = usersRepository.findByNationalIdentifier(request.nationalIdentifier());
        if (nationalIdentifierFounded.isPresent()) {
            throw new FlowException("National identifier already registered.", HttpStatus.BAD_REQUEST);
        }
        var userEntity = usersMapper.toEntity(request);
        var address = addressesMapper.toEntity(request.address());
        userEntity.setPassword(passwordEncoder.encode(request.password()));
        userEntity.setAddress(address);
        var user = usersRepository.save(userEntity);
        return usersMapper.toResponse(user);
    }
}
