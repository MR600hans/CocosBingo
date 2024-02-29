using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MyCamRayCast : MonoBehaviour
{
    public Camera myCam;
    RaycastHit hitObject;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 pos = Input.mousePosition;
        Ray mouseRay = myCam.ScreenPointToRay(pos);

        if(Input.GetMouseButtonDown(0)){
            if(Physics.Raycast(mouseRay, out hitObject )){
                print(hitObject.collider.gameObject.tag);
            }
        }
    }
}
