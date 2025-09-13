package br.com.api.passit.services;

import br.com.api.passit.db.Users;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.AddressesMapper;
import br.com.api.passit.mappers.UsersMapper;
import br.com.api.passit.to.GetUsersRequestTO;
import br.com.api.passit.to.GetUsersResponseTO;
import br.com.api.passit.to.OrderEnum;
import br.com.api.passit.to.SortUserEnum;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersServices {

    private final UsersRepository usersRepository;
    private final UsersMapper usersMapper;
    private final AddressesMapper addressesMapper;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

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

    public UsersResponseTO update(UUID userId, UUID authUserId, UsersRequestTO request) {
        var authUserById = usersRepository.findById(authUserId);
        if (authUserById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User " + request.name() + " not found.", HttpStatus.NOT_FOUND);
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

    public UsersResponseTO getById(UUID userId, UUID authUserId) {
        var authUserById = usersRepository.findById(authUserId);
        if (authUserById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        return usersMapper.toResponse(userById.get());
    }

    public GetUsersResponseTO get(GetUsersRequestTO request, UUID authUserId) {
        var authUserById = usersRepository.findById(authUserId);
        if (authUserById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        List<UsersResponseTO> usersResponse = new ArrayList<>();
        var criteriaBuilder = entityManager.getCriteriaBuilder();
        var criteriaQuery = criteriaBuilder.createQuery(Users.class);
        var root = criteriaQuery.from(Users.class);
        var predicates = buildPredicate(criteriaBuilder, root, request);
        var countQuery = buildCountQuery(predicates);
        if (countQuery.intValue() > 0) {
            criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
            criteriaQuery.orderBy(sortAndOrderToUsers(criteriaBuilder, root, request));
            var typedQuery = entityManager.createQuery(criteriaQuery);
            typedQuery.setFirstResult(request.offset());
            typedQuery.setMaxResults(request.limit());
            var users = typedQuery.getResultList();
            usersResponse = buildGetUsersResponse(users);
        }
        return new GetUsersResponseTO(usersResponse, countQuery.intValue());
    }

    private List<Predicate> buildPredicate(CriteriaBuilder criteriaBuilder, Root<Users> root, GetUsersRequestTO request) {
        var predicates = new ArrayList<Predicate>();
        if (request.name() != null && !request.name().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("name"), "%" + request.name().toLowerCase() + "%"));
        }
        if (request.email() != null && !request.email().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("email"), "%" + request.email().toLowerCase() + "%"));
        }
        if (request.userType() != null && !request.userType().name().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("userType"), request.userType().name()));
        }
        return predicates;
    }

    private Long buildCountQuery(List<Predicate> predicates) {
        var criteriaBuilder = entityManager.getCriteriaBuilder();
        var countQuery = criteriaBuilder.createQuery(Long.class);
        var root = countQuery.from(Users.class);
        countQuery.select(criteriaBuilder.count(root));
        if (!predicates.isEmpty()) {
            countQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
        }
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private Order sortAndOrderToUsers(CriteriaBuilder criteriaBuilder, Root<Users> root, GetUsersRequestTO request) {
        var sortFilter = request.sort();
        var orderFilter = request.order();
        if (sortFilter == null) sortFilter = SortUserEnum.NAME;
        if (orderFilter == null) orderFilter = OrderEnum.DESC;
        return switch (sortFilter) {
            case EMAIL -> orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("email")) : criteriaBuilder.desc(root.get("email"));
            case TYPE -> orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("userType")) : criteriaBuilder.desc(root.get("userType"));
            default ->  orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("name")) : criteriaBuilder.desc(root.get("name"));
        };
    }

    private List<UsersResponseTO> buildGetUsersResponse(List<Users> users) {
        return users.stream().map(usersMapper::toResponse).toList();
    }

    public void delete(UUID userId, UUID authUserId) {
        var authUserById = usersRepository.findById(authUserId);
        if (authUserById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("Id " + userId + " not found.", HttpStatus.NOT_FOUND);
        }
        usersRepository.deleteById(userId);
    }
}
