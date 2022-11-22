package br.ifpr.crud.service;

//import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import br.ifpr.crud.exception.ApiException;
//import br.ifpr.crud.exception.NegocioException;
import br.ifpr.crud.model.Veiculo;
import br.ifpr.crud.repository.VeiculoRepository;

@Component
public class VeiculoService {
	
	@Autowired
	private VeiculoRepository clienteRepository;
	
	public ResponseEntity<Veiculo> inserir(Veiculo veiculo) {
		try {
			veiculo = clienteRepository.save(veiculo);
			return new ResponseEntity<Veiculo>(veiculo, HttpStatus.CREATED); 
		} catch (Exception e) {
			throw new ApiException("Erro ao inserir o veículo.");
		}
	}
	
}
