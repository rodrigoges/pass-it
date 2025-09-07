package br.com.api.passit.services;

import br.com.api.passit.db.ItemsRepository;
import br.com.api.passit.db.RequisitionsRepository;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.RequisitionsMapper;
import br.com.api.passit.to.RequisitionsRequestTO;
import br.com.api.passit.to.RequisitionsResponseTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequisitionsServices {

    private final RequisitionsRepository requisitionsRepository;
    private final ItemsRepository itemsRepository;
    private final UsersRepository usersRepository;
    private final RequisitionsMapper requisitionsMapper;

    public RequisitionsResponseTO request(RequisitionsRequestTO request, UUID userId) {
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var requesterById = usersRepository.findById(request.requester());
        if (requesterById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var itemFounded = itemsRepository.findById(request.item())
                .orElseThrow(() -> new FlowException("Item not found.", HttpStatus.NOT_FOUND));
        if (itemFounded.getUser().getUserId().equals(request.requester())) {
            throw new FlowException("Unable to request own item.", HttpStatus.CONFLICT);
        }
        var requisitionEntity = requisitionsMapper.toEntity(request);
        var requisitions = requisitionsRepository.save(requisitionEntity);
        return requisitionsMapper.toResponse(requisitions);
    }
}
