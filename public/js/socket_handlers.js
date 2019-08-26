		var socket = io();

		socket.on('rotor_data', (data)=>{
			console.log(data)
		})


		socket.on('temp_data', (data)=>{
      console.log(data)
      display_latest_temp_data(data)
		})