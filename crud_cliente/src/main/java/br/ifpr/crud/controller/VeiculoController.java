package br.ifpr.crud.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ifpr.crud.exception.ApiException;
import br.ifpr.crud.model.Veiculo;
import br.ifpr.crud.repository.VeiculoRepository;
import br.ifpr.crud.service.VeiculoService;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {
	
	@Autowired
	private VeiculoRepository veiculoRepository;
	
	@Autowired
	private VeiculoService veiculoService;
	
	@CrossOrigin
	@GetMapping
	public List<Veiculo> listar() {
		return veiculoRepository.findAll();
	}
	
	@CrossOrigin
	@GetMapping("/{id}")
	public ResponseEntity<Veiculo> buscar(
			@PathVariable Integer id) {
		Optional<Veiculo> optVeiculo = 
				veiculoRepository.findById(id);
		
		if(optVeiculo.isPresent())
			return new ResponseEntity<Veiculo>(
					optVeiculo.get(), HttpStatus.OK);
		
		return new ResponseEntity<Veiculo>(HttpStatus.NOT_FOUND);
	}
	
	@CrossOrigin
	@PostMapping
	public ResponseEntity<Veiculo> inserir(
			@RequestBody Veiculo veiculo) {
	
		return veiculoService.inserir(veiculo);
	}
	
	@CrossOrigin
	@PutMapping("/{id}")
	public ResponseEntity<Veiculo> atualizar(
			@PathVariable Integer id,
			@RequestBody Veiculo veiculo) {
		return veiculoService.atualizar(id, veiculo);
	}
	
	@CrossOrigin
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> remover(@PathVariable Integer id) {
		if(! veiculoRepository.existsById(id))
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		
		try {
			veiculoRepository.deleteById(id);
			
			return new ResponseEntity<Void>(HttpStatus.OK);
		} catch (Exception e) {
			throw new ApiException("Erro ao remover o veículo.");
		}
	}

}
