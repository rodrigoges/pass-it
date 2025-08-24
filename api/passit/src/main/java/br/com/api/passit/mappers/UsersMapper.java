package br.com.api.passit.mappers;

import br.com.api.passit.db.Users;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsersMapper {

    @Mapping(source = "userType", target = "userType")
    Users toEntity(UsersRequestTO dto);

    UsersResponseTO toResponse(Users users);
}
