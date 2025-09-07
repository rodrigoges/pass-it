package br.com.api.passit.mappers;

import br.com.api.passit.db.Requisitions;
import br.com.api.passit.to.RequisitionsRequestTO;
import br.com.api.passit.to.RequisitionsResponseTO;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface RequisitionsMapper {

    Requisitions toEntity(RequisitionsRequestTO request);

    RequisitionsResponseTO toResponse(Requisitions requisitions);
}
