package pizzaria;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

public class Encomenda {
    private int id;
    private int clienteId;
    private LocalDateTime dataHora;
    private String tipoEntrega;
    private BigDecimal taxaEntrega;
    private List<EncomendaPizza> pizzas;

    public Encomenda() {}

    public Encomenda(int id, int clienteId, LocalDateTime dataHora, String tipoEntrega, BigDecimal taxaEntrega) {
        this.id = id;
        this.clienteId = clienteId;
        this.dataHora = dataHora;
        this.tipoEntrega = tipoEntrega;
        this.taxaEntrega = taxaEntrega;
    }

    // Getters e Setters
    public int getId() { return id; }
    public int getClienteId() { return clienteId; }
    public LocalDateTime getDataHora() { return dataHora; }
    public String getTipoEntrega() { return tipoEntrega; }
    public BigDecimal getTaxaEntrega() { return taxaEntrega; }
    public List<EncomendaPizza> getPizzas() { return pizzas; }

    public void setId(int id) { this.id = id; }
    public void setClienteId(int clienteId) { this.clienteId = clienteId; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    public void setTaxaEntrega(BigDecimal taxaEntrega) { this.taxaEntrega = taxaEntrega; }
    public void setPizzas(List<EncomendaPizza> pizzas) { this.pizzas = pizzas; }
}