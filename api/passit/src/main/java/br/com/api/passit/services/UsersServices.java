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

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersServices {

    private final UsersRepository usersRepository;
    private final UsersMapper usersMapper;
    private final AddressesMapper addressesMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsersResponseTO create(UsersRequestTO request) {
        var userByEmail = usersRepository.findByEmail(request.email().toLowerCase());
        if (userByEmail.isPresent()) {
            throw new FlowException("E-mail " + request.email() + " already registered.", HttpStatus.BAD_REQUEST);
        }
        var userByNationalIdentifier = usersRepository.findByNationalIdentifier(request.nationalIdentifier());
        if (userByNationalIdentifier.isPresent()) {
            throw new FlowException("National identifier already registered.", HttpStatus.BAD_REQUEST);
        }
        var userEntity = usersMapper.toEntity(request);
        var address = addressesMapper.toEntity(request.address());
        userEntity.setPassword(passwordEncoder.encode(request.password()));
        userEntity.setAddress(address);
        var user = usersRepository.save(userEntity);
        return usersMapper.toResponse(user);
    }

    public UsersResponseTO update(UUID userId, UsersRequestTO request) {
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User " + request.name() + " not found.", HttpStatus.BAD_REQUEST);
        }
        var userByEmail = usersRepository.findByEmail(request.email().toLowerCase());
        if (userByEmail.isPresent() && !userByEmail.get().getUserId().equals(userId)) {
            throw new FlowException("E-mail " + request.email() + " already registered.", HttpStatus.BAD_REQUEST);
        }
        var userByNationalIdentifier = usersRepository.findByNationalIdentifier(request.nationalIdentifier());
        if (userByNationalIdentifier.isPresent() && !userByNationalIdentifier.get().getUserId().equals(userId)) {
            throw new FlowException("National identifier already registered.", HttpStatus.BAD_REQUEST);
        }
        var userEntity = usersMapper.toEntity(request);
        var address = addressesMapper.toEntity(request.address());
        userEntity.setUserId(userId);
        userEntity.setPassword(passwordEncoder.encode(request.password()));
        userEntity.setAddress(address);
        var user = usersRepository.save(userEntity);
        return usersMapper.toResponse(user);
    }
}
