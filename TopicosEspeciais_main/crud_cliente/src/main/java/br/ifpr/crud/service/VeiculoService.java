package br.ifpr.crud.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import br.ifpr.crud.exception.ApiException;
import br.ifpr.crud.exception.NegocioException;
import br.ifpr.crud.model.Veiculo;
import br.ifpr.crud.repository.VeiculoRepository;

@Component
public class VeiculoService {
	
	@Autowired
	private VeiculoRepository veiculoRepository;
	
	public ResponseEntity<Veiculo> inserir(Veiculo veiculo) {
		try {
			//Validar campos obrigatórios
			this.validaCamposObrigatorios(veiculo);	
			
			//Validar o placa duplicada
			this.validaPlacaDuplicada(veiculo.getPlaca(),
					0);
		
			//Salvar
			veiculo = veiculoRepository.save(veiculo);
			return new ResponseEntity<Veiculo>(veiculo, HttpStatus.CREATED); 
		} catch (Exception e) {
			if(e instanceof NegocioException)
				throw e;
			else
				throw new ApiException("Erro ao inserir o veículo.");
		}
	}
	
	public ResponseEntity<Veiculo> atualizar(Integer id, 
										Veiculo veiculo) {
		if(! veiculoRepository.existsById(id))
			return new ResponseEntity<Veiculo>(HttpStatus.NOT_FOUND);
		
		try {
			//Validar campos obrigatórios
			this.validaCamposObrigatorios(veiculo);
			
			//Validar o placa duplicada
			this.validaPlacaDuplicada(veiculo.getPlaca(),
					id);
			
			veiculo.setId(id);
			veiculoRepository.save(veiculo);
			
			return new ResponseEntity<Veiculo>(veiculo, HttpStatus.OK);
		} catch (Exception e) {
			if(e instanceof NegocioException)
				throw e;
			else
				throw new ApiException("Erro ao atualizar o veículo.");
		}
		
	}
	
	private void validaCamposObrigatorios(Veiculo veiculo) 
				throws NegocioException {
		//Validar placa
		if(veiculo.getPlaca() == null || 
				veiculo.getPlaca().trim().equals(""))
			throw new NegocioException("Erro ao salvar o veículo." + 
					" Campo placa é obrigatório.");
		
		//Validar modelo
		if(veiculo.getModelo() == null || 
				veiculo.getModelo().trim().equals(""))
			throw new NegocioException("Erro ao salvar o veículo." + 
					" Campo modelo é obrigatório.");
		
		//Validar fabricante
		if(veiculo.getFabricante() == null || 
				veiculo.getFabricante().trim().equals(""))
			throw new NegocioException("Erro ao salvar o veiculo." + 
					" Campo fabricante é obrigatório.");
		
		//Validar o anoFabricacao
		if(veiculo.getAnoFabricacao() == null || 
				veiculo.getAnoFabricacao().trim().equals(""))
			throw new NegocioException("Erro ao salvar o veiculo." + 
					" Campo ano de fabricacao é obrigatório.");
	}
	
	private void validaPlacaDuplicada(String placa, 
				Integer idVeiculo) throws NegocioException {
		
		Optional<Veiculo> optVeiculo = 			
				veiculoRepository.findByPlaca(placa);
		
		if(optVeiculo.isPresent() &&
				(! optVeiculo.get().getId().equals(idVeiculo)) )
			throw new NegocioException(
					"Erro ao salvar o veículo." + 
					" Placa já utilizada por outro veículo!");
	}
	
}
