Rails.application.routes.draw do
  scope '/api' do
    # Temporary mock endpoints - returns empty data to stop errors
    get 'types', to: proc { [200, { 'Content-Type' => 'application/json' }, [
      '[{"id":"reagent"},{"id":"sample"},{"id":"equipment"},{"id":"consumable"}]'
    ]] }
    
    get 'unitOptions', to: proc { [200, { 'Content-Type' => 'application/json' }, [
      '{"reagent":["mL","µL","g","mg","units"],"sample":["vials","tubes","slides","µg","samples"],"equipment":["unit","set","piece"],"consumable":["pcs","boxes","packs","sheets","strips"]}'
    ]] }
    
    get 'materials', to: proc { [200, { 'Content-Type' => 'application/json' }, ['[]']] }
  end
end
